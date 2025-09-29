import { useState, FCC } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, FileUpload, DropEvent } from '@patternfly/react-core';
import { FieldBuilder } from '@patternfly/react-component-groups/dist/dynamic/FieldBuilder';
import { SecretSubFormProps, OpaqueDataEntry } from './types';
import { opaqueSecretObjectToArray, newOpaqueSecretEntry, opaqueEntriesToObject } from './utils';
import { Base64 } from 'js-base64';

export const OpaqueSecretForm: FCC<SecretSubFormProps> = ({ onChange, base64StringData }) => {
  const { t } = useTranslation();
  const [opaqueDataEntries, setOpaqueDataEntries] = useState<OpaqueDataEntry[]>(
    opaqueSecretObjectToArray(base64StringData),
  );

  // Handle adding a new key/value row
  const handleAddEntry = () => {
    const newEntries = [...opaqueDataEntries, newOpaqueSecretEntry()];
    setOpaqueDataEntries(newEntries);
    onChange(opaqueEntriesToObject(newEntries));
  };

  // Handle removing a key/value row
  const handleRemoveEntry = (_event: React.MouseEvent, index: number) => {
    const newEntries = opaqueDataEntries.filter((_, i) => i !== index);
    setOpaqueDataEntries(newEntries);
    onChange(opaqueEntriesToObject(newEntries));
  };

  // Handle updating key data
  const handleKeyChange = (index: number, value: string) => {
    const updatedEntries = [...opaqueDataEntries];
    updatedEntries[index] = { ...updatedEntries[index], key: value };
    setOpaqueDataEntries(updatedEntries);
    onChange(opaqueEntriesToObject(updatedEntries));
  };

  // Handle file upload for values
  const handleFileUpload = (index: number, _event: DropEvent, file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const isBinary = file.type && !file.type.startsWith('text/');
        const updatedEntries = [...opaqueDataEntries];
        updatedEntries[index] = {
          ...updatedEntries[index],
          value: isBinary ? result : Base64.encode(result),
          isBinary_: isBinary,
        };
        setOpaqueDataEntries(updatedEntries);
        onChange(opaqueEntriesToObject(updatedEntries));
      };
      if (file.type && !file.type.startsWith('text/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }
  };

  // Handle text value changes
  const handleTextValueChange = (index: number, value: string) => {
    const updatedEntries = [...opaqueDataEntries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      value: Base64.encode(value),
      isBinary_: false,
    };
    setOpaqueDataEntries(updatedEntries);
    onChange(opaqueEntriesToObject(updatedEntries));
  };

  return (
    <>
      <FieldBuilder
        isRequired
        firstColumnLabel={t('public~Key')}
        secondColumnLabel={t('public~Value')}
        rowCount={opaqueDataEntries.length}
        onAddRow={handleAddEntry}
        onRemoveRow={handleRemoveEntry}
        addButtonContent={t('public~Add key/value')}
        data-test="add-credentials-button"
      >
        {({ focusRef, firstColumnAriaLabel, secondColumnAriaLabel }, index) => [
          <TextInput
            key="key"
            ref={focusRef}
            type="text"
            value={opaqueDataEntries[index]?.key || ''}
            placeholder={t('public~Enter key')}
            onChange={(_event, value) => handleKeyChange(index, value)}
            aria-label={firstColumnAriaLabel}
            data-test="secret-key"
            isRequired
            className="pf-v6-u-mt-sm"
          />,
          <FileUpload
            key="value"
            id={`${opaqueDataEntries[index]?.uid || index}-value`}
            value={
              opaqueDataEntries[index]?.isBinary_
                ? undefined
                : opaqueDataEntries[index]?.value
                ? Base64.decode(opaqueDataEntries[index].value)
                : ''
            }
            filename={opaqueDataEntries[index]?.isBinary_ ? t('public~Binary file uploaded') : ''}
            filenamePlaceholder={t('public~Drag a file here or browse to upload')}
            onFileInputChange={(event: DropEvent, file: File) =>
              handleFileUpload(index, event, file)
            }
            onTextChange={(_event, value: string) => handleTextValueChange(index, value)}
            browseButtonText={t('public~Upload')}
            clearButtonText={t('public~Clear')}
            onClearClick={() => handleTextValueChange(index, '')}
            allowEditingUploadedText
            hideDefaultPreview
            aria-label={secondColumnAriaLabel}
            dropzoneProps={{
              accept: undefined, // Allow all file types
            }}
            validated={opaqueDataEntries[index]?.key ? 'default' : 'error'}
            isRequired
            className="pf-v6-u-mt-0"
          />,
        ]}
      </FieldBuilder>
    </>
  );
};
