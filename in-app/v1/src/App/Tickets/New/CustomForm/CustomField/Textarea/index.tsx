import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import cx from 'classnames';

import { CustomFieldProps } from '..';
import { Description } from '../Description';

const DEFAULT_ROWS = 3;

export function Textarea({ id, description, required, htmlId }: CustomFieldProps) {
  const { t } = useTranslation();
  const { register, formState } = useFormContext();
  const error = formState.errors[id];

  return (
    <div>
      <textarea
        {...register(id, {
          required: {
            value: required,
            message: t('validation.required'),
          },
        })}
        id={htmlId}
        className={cx('w-full px-3 py-1.5 border rounded text-sm', {
          'border-red-500': error,
          'border-[rgba(0,0,0,0.08)]': !error,
          'focus:border-tapBlue focus:ring-1 focus:ring-tapBlue': !error,
        })}
        rows={DEFAULT_ROWS}
      />
      <Description error={error}>{description}</Description>
    </div>
  );
}