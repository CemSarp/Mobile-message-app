import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

/**
 * A polished register screen with inline validation, loading indicator
 * and cleaner state management.
 */
const RegisterScreen = () => {
  const navigation = useNavigation();

  // consolidated form state
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirm: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  ///////////////////////////////
  // handlers
  ///////////////////////////////
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' })); // clear error on change
  };

  /**
   * Basic client‑side validation.
   * More sophisticated checks (e.g. password strength) can be added later.
   */
  const validate = () => {
    const _errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email.trim())) {
      _errors.email = 'Enter a valid e‑mail address';
    }

    if (form.password.length < 6) {
      _errors.password = 'Minimum 6 characters';
    }

    if (form.password !== form.confirm) {
      _errors.confirm = 'Passwords do not match';
    }

    setErrors(_errors);
    return Object.keys(_errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) {return;} // stop if form has errors

    setLoading(true);
    try {
      await axios.post('http://localhost:8080/auth/register', {
        email: form.email.trim(),
        password: form.password,
      });

      Alert.alert('Success', 'Registration successful! Please log in.');
      navigation.replace('Login');
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Registration failed, please try again.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  ///////////////////////////////
  // render
  ///////////////////////////////
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        <Input
          placeholder="Email"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(v) => handleChange('email', v)}
          error={errors.email}
          autoCapitalize="none"
        />
        <Input
          placeholder="Password"
          secureTextEntry
          value={form.password}
          onChangeText={(v) => handleChange('password', v)}
          error={errors.password}
          autoCapitalize="none"
        />
        <Input
          placeholder="Confirm Password"
          secureTextEntry
          value={form.confirm}
          onChangeText={(v) => handleChange('confirm', v)}
          error={errors.confirm}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}
                          style={styles.footerLink}
        >
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

/////////////////////////////////
// Reusable input component
/////////////////////////////////
const Input = ({ error, ...props }) => (
  <View style={{ width: '100%', marginBottom: 14 }}>
    <TextInput
      {...props}
      style={[styles.input, error && { borderColor: '#e63946' }]}
    />
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

/////////////////////////////////
// Styles
/////////////////////////////////
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  errorText: {
    color: '#e63946',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  footerLink: {
    marginTop: 18,
    alignItems: 'center',
  },
  linkText: {
    color: '#007BFF',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default RegisterScreen;
