import * as React from 'react';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { FormikValues, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { SecretFormType } from '@console/internal/components/secrets/create-secret';
import { ExpandCollapse } from '@console/internal/components/utils';
import { SecretModel } from '@console/internal/models';
import { ResourceDropdownField } from '@console/shared/src';
import { secretModalLauncher } from '../../import/CreateSecretModal';

const AdvancedImageOptions = () => {
  const { t } = useTranslation();
  const {
    setFieldValue,
    values: {
      formData: {
        project: { name: namespace },
      },
    },
  } = useFormikContext<FormikValues>();

  const filterData = (item) => {
    return (
      item.type === 'kubernetes.io/dockercfg' || item.type === 'kubernetes.io/dockerconfigjson'
    );
  };
  const handleSave = (name: string) => {
    setFieldValue('formData.imagePullSecret', name);
  };

  React.useEffect(() => {
    const handleFormSubmissionPrevention = (e: Event) => {
      const target = e.target as HTMLElement;
      // prevents scroll to when clicking on dropdown menu items with href="#"
      if (target && target.closest('a[href="#"]')) {
        e.preventDefault();
      }
    };

    document.addEventListener('click', handleFormSubmissionPrevention, { capture: true });
    return () =>
      document.removeEventListener('click', handleFormSubmissionPrevention, { capture: true });
  }, []);

  return (
    <ExpandCollapse
      textExpanded={t('devconsole~Hide advanced image options')}
      textCollapsed={t('devconsole~Show advanced image options')}
    >
      <ResourceDropdownField
        name="formData.imagePullSecret"
        label={t('devconsole~Pull Secret')}
        helpText={t(
          'devconsole~Secret for authentication when pulling image from a secured registry.',
        )}
        placeholder={t('devconsole~Select Secret name')}
        resources={[
          {
            isList: true,
            namespace,
            kind: SecretModel.kind,
            prop: 'secrets',
          },
        ]}
        resourceFilter={filterData}
        dataSelector={['metadata', 'name']}
        dataTest="secrets-dropdown"
        fullWidth
      />
      <Button
        className="pf-m-link--align-left"
        variant={ButtonVariant.link}
        onClick={() =>
          secretModalLauncher({
            namespace,
            save: handleSave,
            formType: SecretFormType.image,
          })
        }
      >
        {t('devconsole~Create new Secret')}
      </Button>
    </ExpandCollapse>
  );
};

export default AdvancedImageOptions;
