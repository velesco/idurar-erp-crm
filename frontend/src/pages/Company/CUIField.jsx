import React, { useEffect, useRef } from 'react';
import { Input, message } from 'antd';

const CUIField = (props) => {
  const { onChange, value, onBlur, ...rest } = props;
  const formRef = useRef(null);
  
  // Find closest form container (try to get reference to form context)
  useEffect(() => {
    // Try to find parent form element to search within it
    formRef.current = document.querySelector('form') || document.body;
  }, []);

  const handleCUIChange = async (e) => {
    // Call the original onChange handler
    if (onChange) {
      onChange(e);
    }
    
    const cuiValue = e.target.value;
    
    // Only proceed if we have valid CUI
    if (cuiValue && cuiValue.length >= 6) {
      try {
        // Find name input by searching the DOM
        const nameInput = formRef.current.querySelector('input[name="name"]');
        
        if (!nameInput) {
          console.error('Name input field not found');
          return;
        }
        
        // Use fetch API to get company data
        const response = await fetch(`https://api.aipro.ro/get?cui=${cuiValue}`);
        const data = await response.json();
        
        if (data && data.nume_companie) {
          console.log('Company name found:', data.nume_companie);
          
          // Set the value directly
          nameInput.value = data.nume_companie;
          
          // Trigger events to update React state
          nameInput.dispatchEvent(new Event('input', { bubbles: true }));
          nameInput.dispatchEvent(new Event('change', { bubbles: true }));
          
          // Show success message
          message.success(`Company found: ${data.nume_companie}`);
        } else {
          console.log('No company data found for CUI:', cuiValue);
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    }
  };

  return (
    <Input
      {...rest}
      value={value}
      onChange={handleCUIChange}
      onBlur={onBlur}
    />
  );
};

export default CUIField;