import * as React from 'react';
import { Button } from '@patternfly/react-core';
import { CloseIcon } from '@patternfly/react-icons/dist/esm/icons/close-icon';
import * as classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import './CloseButton.scss';

type CloseButtonProps = {
  additionalClassName?: string;
  ariaLabel?: string;
  dataTestID?: string;
  onClick: (e: any) => void;
};

const CloseButton: React.FC<CloseButtonProps> = ({
  additionalClassName,
  ariaLabel,
  dataTestID,
  onClick,
}) => {
  const { t } = useTranslation();
  return (
    <Button
      aria-label={ariaLabel || t('public~Close')}
      className={classNames('co-close-button', additionalClassName)}
      data-test-id={dataTestID}
      onClick={onClick}
      variant="plain"
    >
      <CloseIcon />
    </Button>
  );
};

export default CloseButton;
