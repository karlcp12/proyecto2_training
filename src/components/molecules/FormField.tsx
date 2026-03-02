interface FormFieldProps {
  label: string;
  placeholder: string;
  type: 'text' | 'password';
}

export const FormField = ({ label, placeholder, type }: FormFieldProps) => (
  <div style={{ marginBottom: '15px', textAlign: 'left' }}>
    <label style={{ display: 'block', fontWeight: 'bold' }}>{label}</label>
    <input 
      type={type} 
      placeholder={placeholder} 
      style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} 
    />
  </div>
);