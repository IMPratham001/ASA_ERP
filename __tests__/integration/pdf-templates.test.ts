
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PDFTemplateEditor } from '@/components/settings/pdf-template-editor';

describe('PDF Template Management', () => {
  beforeEach(() => {
    render(<PDFTemplateEditor />);
  });

  it('should create new template', async () => {
    const nameInput = screen.getByLabelText('Template Name');
    fireEvent.change(nameInput, { target: { value: 'Test Template' } });
    
    const saveButton = screen.getByText('Save Template');
    fireEvent.click(saveButton);
    
    expect(await screen.findByText('Template saved successfully')).toBeInTheDocument();
  });
});
