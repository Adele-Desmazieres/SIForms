import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import colors from '@/constants/colors';
import { Formik } from 'formik';
import * as Yup from 'yup';
import jsonSchema from '../assets/data.json';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { router, Stack } from 'expo-router';
import CustomButton from '@/components/customButton';

/**
 * Fonction utilitaire pour accéder aux valeurs imbriquées.
 * Cette version supporte également la notation avec crochets (ex. "addresses[0].city")
 */
const getIn = (obj, key) => {
  if (!obj || !key) return undefined;
  // Convertir "addresses[0].city" en "addresses.0.city"
  const path = key.replace(/\[(\w+)\]/g, '.$1').split('.');
  return path.reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
};

/**
 * Résolution des références ($ref) dans le schéma JSON.
 */
const resolveRef = (schema, definitions) => {
  if (typeof schema !== 'object' || schema === null) return schema;

  if (schema.$ref) {
    const refPath = schema.$ref.replace(/^#\//, '');
    const parts = refPath.split('/');
    let resolved = definitions;
    if (parts[0] === 'definitions') {
      parts.shift();
    }
    for (const part of parts) {
      resolved = resolved && resolved[part];
    }
    if (!resolved) {
      console.warn(`Référence non trouvée: ${schema.$ref}`);
      return schema;
    }
    const { $ref, ...rest } = schema;
    return resolveRef({ ...resolved, ...rest }, definitions);
  }

  if (Array.isArray(schema)) {
    return schema.map((item) => resolveRef(item, definitions));
  }

  return Object.keys(schema).reduce((acc, key) => {
    acc[key] = resolveRef(schema[key], definitions);
    return acc;
  }, {});
};

/**
 * Génère les valeurs initiales du formulaire à partir du schéma.
 */
const generateInitialValues = (schema) => {
  const initialValues = {};
  if (schema.type === 'object' && schema.properties) {
    Object.keys(schema.properties).forEach((key) => {
      const field = schema.properties[key];
      if (field.type === 'boolean') {
        initialValues[key] = false;
      } else if (field.type === 'array') {
        // Utiliser la valeur par défaut si elle existe, sinon un tableau vide
        initialValues[key] = field.default || [];
      } else if (field.type === 'object') {
        initialValues[key] = generateInitialValues(field);
      } else {
        initialValues[key] = '';
      }
    });
  }
  return initialValues;
};

/**
 * Génération du schéma de validation Yup.
 */
const generateYupSchema = (schema) => {
  const yupFields = {};
  if (schema.type === 'object' && schema.properties) {
    Object.keys(schema.properties).forEach((key) => {
      let field = schema.properties[key];
      if (field.$ref) {
        field = resolveRef(field, schema.definitions || {});
      }
      if (field.type === 'string') {
        yupFields[key] = field.required ? Yup.string().required() : Yup.string();
      } else if (field.type === 'number' || field.type === 'integer') {
        yupFields[key] = field.required ? Yup.number().required() : Yup.number();
      } else if (field.type === 'boolean') {
        yupFields[key] = Yup.boolean();
      } else if (field.type === 'object') {
        yupFields[key] = generateYupSchema(field);
      }
      // Pour les tableaux, vous pouvez ajouter des validations spécifiques si nécessaire
    });
  }
  return Yup.object().shape(yupFields);
};

/**
 * Fonction qui ouvre la médiathèque pour choisir une image
 * et met à jour le champ correspondant.
 */
const handleImagePick = async (fieldName, values, setFieldValue) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission required', 'We need permission to access your photos.');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.5,
  });

  if (!result.canceled) {
    const uri = result.assets[0].uri;
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    // Si le champ est un tableau, on ajoute l'image, sinon on remplace la valeur
    if (Array.isArray(getIn(values, fieldName))) {
      setFieldValue(fieldName, [...(getIn(values, fieldName) || []), dataUrl]);
    } else {
      setFieldValue(fieldName, dataUrl);
    }
  }
};

/**
 * Ajoute un élément dans un tableau.
 * @param {string} fieldName - Le nom du champ dans Formik (ex. "addresses")
 * @param {object} values - Les valeurs actuelles du formulaire
 * @param {function} setFieldValue - La fonction Formik pour mettre à jour la valeur du champ
 * @param {object} fieldSchema - Le schéma correspondant au champ (doit contenir "items")
 */
const addArrayItem = (fieldName, values, setFieldValue, fieldSchema) => {
  if (fieldSchema && fieldSchema.items && fieldSchema.items.type === 'object') {
    const newItem = generateInitialValues(fieldSchema.items);
    setFieldValue(fieldName, [...(getIn(values, fieldName) || []), newItem]);
  } else {
    // Pour un tableau de chaînes par exemple, on ajoute une chaîne vide
    setFieldValue(fieldName, [...(getIn(values, fieldName) || []), '']);
  }
};

/**
 * Rendu récursif des champs du formulaire.
 */
const renderFields = (
  schema,
  handleChange,
  handleBlur,
  values,
  setFieldValue,
  errors,
  touched,
  prefix = ''
) => {
  if (schema.type === 'object' && schema.properties) {
    return Object.keys(schema.properties).map((key) => {
      const field = schema.properties[key];
      const fieldName = prefix ? `${prefix}.${key}` : key;
      return (
        <View key={fieldName} style={styles.inputContainer}>
          <Text style={styles.label}>{field.title || key}</Text>
          {renderField(field, fieldName, handleChange, handleBlur, values, setFieldValue, errors, touched)}
        </View>
      );
    });
  }
  return null;
};

/**
 * Rendu d'un champ unique selon son type.
 */
const renderField = (
  field,
  fieldName,
  handleChange,
  handleBlur,
  values,
  setFieldValue,
  errors,
  touched
) => {
  // Gestion des champs de type string avec format "data-url" (pour les images/documents)
  if (field.type === 'string' && field.format === 'data-url') {
    const value = getIn(values, fieldName);
    return (
      <View>
        {value ? <Text style={styles.infoText}>Document added.</Text> : <Text style={styles.infoText}>No document selected.</Text>}
        <Button title="Choose document" onPress={() => handleImagePick(fieldName, values, setFieldValue)} color={colors.darkGreen} />
      </View>
    );
  }

  // Gestion des tableaux dont les items sont de type "string" et format "data-url"
  if (field.type === 'array' && field.items && field.items.format === 'data-url') {
    const currentValue = getIn(values, fieldName) || [];
    return (
      <View>
        {currentValue.length > 0 &&
          currentValue.map((doc, index) => (
            <View key={index} style={styles.imageContainer}>
              <Text style={styles.infoText}>Document {index + 1}</Text>
            </View>
          ))}
        <Button title="Add document" onPress={() => handleImagePick(fieldName, values, setFieldValue)} color={colors.darkGreen} />
      </View>
    );
  }

  // Autres types
  switch (field.type) {
    case 'string':
      return (
        <TextInput
          style={styles.input}
          placeholder={field.placeholder || field.title || fieldName}
          onChangeText={handleChange(fieldName)}
          onBlur={handleBlur(fieldName)}
          value={getIn(values, fieldName) || ''}
        />
      );
    case 'number':
    case 'integer':
      return (
        <TextInput
          style={styles.input}
          placeholder={field.placeholder || field.title || fieldName}
          keyboardType="numeric"
          onChangeText={handleChange(fieldName)}
          onBlur={handleBlur(fieldName)}
          value={getIn(values, fieldName) ? String(getIn(values, fieldName)) : ''}
        />
      );
    case 'boolean':
      return (
        <Switch
          value={!!getIn(values, fieldName)}
          onValueChange={(value) => setFieldValue(fieldName, value)}
        />
      );
    case 'array':
      // Pour les tableaux de chaînes avec anyOf (ex : choix multiples)
      if (field.items && field.items.type === 'string' && field.items.anyOf) {
        const currentValue = getIn(values, fieldName) || [];
        return (
          <View>
            {field.items.anyOf.map((option, index) => {
              const optionValue = option.enum && option.enum.length ? option.enum[0] : '';
              return (
                <View key={index} style={styles.arrayOptionContainer}>
                  <Text style={styles.label}>{option.title || optionValue}</Text>
                  <Switch
                    value={currentValue.includes(optionValue)}
                    onValueChange={(value) => {
                      let updatedValues = [...currentValue];
                      if (value) {
                        if (!updatedValues.includes(optionValue)) {
                          updatedValues.push(optionValue);
                        }
                      } else {
                        updatedValues = updatedValues.filter((item) => item !== optionValue);
                      }
                      setFieldValue(fieldName, updatedValues);
                    }}
                  />
                </View>
              );
            })}
          </View>
        );
      }
      // Pour les tableaux d'objets complexes
      if (field.items && field.items.type === 'object') {
        return (
          <View>
            {(getIn(values, fieldName) || []).map((item, index) => {
              const arrayFieldName = `${fieldName}[${index}]`;
              return (
                <View key={arrayFieldName} style={styles.arrayItemContainer}>
                  {renderFields(
                    field.items,
                    handleChange,
                    handleBlur,
                    values,
                    setFieldValue,
                    errors,
                    touched,
                    arrayFieldName
                  )}
                </View>
              );
            })}
            <Button
              title={`Add ${field.title || fieldName}`}
              onPress={() => addArrayItem(fieldName, values, setFieldValue, field)}
              color={colors.darkGreen}
            />
          </View>
        );
      }
      return null;
    case 'object':
      return renderFields(field, handleChange, handleBlur, values, setFieldValue, errors, touched, fieldName);
    default:
      return null;
  }
};

/**
 * Composant principal DynamicForm.
 */
const DynamicForm = ({ schema = jsonSchema }) => {
  const resolvedSchema = resolveRef(schema, schema.definitions || {});
  const initialValues = generateInitialValues(resolvedSchema);
  const validationSchema = generateYupSchema(resolvedSchema);

  return (
    <>
      <Stack.Screen options={{ title: "Form" }} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          Alert.alert('Form submitted', JSON.stringify(values, null, 2));
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched }) => (
          <ScrollView style={styles.formContainer}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
          >
            <Text style={styles.title}>{resolvedSchema.title || 'Formulaire Dynamique'}</Text>
            {renderFields(resolvedSchema, handleChange, handleBlur, values, setFieldValue, errors, touched)}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 10 }}>
              <CustomButton
                color={colors.darkRed}
                textColor={colors.white}
                labelStyle={{ fontSize: 16 }}
                title="Delete"
                onPress={() => Alert.alert(
                  "Confirm Deletion", 
                  "Are you sure you want to delete? Your changes will not be saved.", 
                  [
                    { text: "No", style: "cancel" },  
                    { text: "Yes", onPress: () => router.replace('/formsList') } 
                  ]
                )}
              />
              {/* <CustomButton
                color={colors.lightGrey}
                textColor={colors.white}
                labelStyle={{ fontSize: 16 }}
                title="Draft"
                onPress={() => console.log('Form saved as draft')}
                
              /> */}
              <CustomButton
                color={colors.lightGreen}
                textColor={colors.white}
                labelStyle={{ fontSize: 16 }}
                title="Submit"
                onPress={handleSubmit}
              />
            </View>
          </ScrollView>
        )}
      </Formik>
    </>
  );
};

const styles = StyleSheet.create({
  formContainer: { padding: 30 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: colors.darkGreen },
  label: { fontSize: 16, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
  inputContainer: { marginBottom: 20 },
  arrayItemContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  arrayOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  imageContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#aaa',
    alignItems: 'center',
  },
  infoText: {
    marginBottom: 5,
    fontStyle: 'italic',
  },

});

export default DynamicForm;
