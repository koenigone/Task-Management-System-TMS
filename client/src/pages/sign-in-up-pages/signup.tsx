import { Stack, TextInput, PasswordInput, Button, Container } from '@mantine/core';
import { useForm } from '@mantine/form';

const SignUp = () => {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value.length >= 8 ? null : 'Password should be at least 8 characters long',
      confirmPassword: (value, values) =>
        value === values.password ? null : 'Passwords do not match',
    },
  });

  const handleSubmit = (values: any) => {
    console.log('Form Values:', values);
  };

  return (
    <Container size="xs">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Email"
            placeholder="Enter your email"
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            {...form.getInputProps('password')}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            {...form.getInputProps('confirmPassword')}
          />
          <Button type="submit">Sign Up</Button>
        </Stack>
      </form>
    </Container>
  );
};

export default SignUp;