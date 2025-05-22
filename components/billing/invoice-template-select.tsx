
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const INVOICE_TEMPLATES = [
  { id: 'modern', name: 'Modern Template' },
  { id: 'classic', name: 'Classic Business' },
  { id: 'minimal', name: 'Minimal Design' },
  { id: 'professional', name: 'Professional' },
];

export function InvoiceTemplateSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select template" />
      </SelectTrigger>
      <SelectContent>
        {INVOICE_TEMPLATES.map((template) => (
          <SelectItem key={template.id} value={template.id}>
            {template.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function InvoiceTemplateSelect({ value, onChange }) {
  const templates = [
    { id: "modern", name: "Modern" },
    { id: "classic", name: "Classic" },
    { id: "minimal", name: "Minimal" },
    { id: "professional", name: "Professional" }
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select template" />
      </SelectTrigger>
      <SelectContent>
        {templates.map((template) => (
          <SelectItem key={template.id} value={template.id}>
            {template.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
