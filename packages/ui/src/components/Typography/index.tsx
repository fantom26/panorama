import clsx from 'clsx'

import styles from '@/components/Typography/index.module.css'

export type TypographyVariant =
  | 'display-default'
  | 'display-sm'
  | 'headline-lg'
  | 'headline-default'
  | 'headline-sm'
  | 'title-lg'
  | 'title-default'
  | 'title-sm'
  | 'label-lg'
  | 'label-default'
  | 'label-sm'
  | 'body-lg'
  | 'body-default'
  | 'body-sm'
  | 'meta-default'
  | 'meta-sm'

export type TypographyColor =
  | 'default'
  | 'default-hover'
  | 'subtle'
  | 'brand'
  | 'brand-hover'
  | 'brand-knockout'
  | 'knockout'
  | 'disabled'
  | 'utility-error'
  | 'utility-warning'
  | 'utility-success'
  | 'utility-info'

export type TypographyProps<C extends React.ElementType = 'p'> = {
  variant?: TypographyVariant
  color?: TypographyColor
  component?: C
} & Omit<React.ComponentPropsWithoutRef<C>, 'color' | 'component' | 'variant'>

const variantClassNames: Record<TypographyVariant, string | undefined> = {
  'display-default': styles.displayDefault,
  'display-sm': styles.displaySm,
  'headline-lg': styles.headlineLg,
  'headline-default': styles.headlineDefault,
  'headline-sm': styles.headlineSm,
  'title-lg': styles.titleLg,
  'title-default': styles.titleDefault,
  'title-sm': styles.titleSm,
  'label-lg': styles.labelLg,
  'label-default': styles.labelDefault,
  'label-sm': styles.labelSm,
  'body-lg': styles.bodyLg,
  'body-default': styles.bodyDefault,
  'body-sm': styles.bodySm,
  'meta-default': styles.metaDefault,
  'meta-sm': styles.metaSm
}

const colorClassNames: Record<TypographyColor, string | undefined> = {
  default: styles.colorDefault,
  'default-hover': styles.colorDefaultHover,
  subtle: styles.colorSubtle,
  brand: styles.colorBrand,
  'brand-hover': styles.colorBrandHover,
  'brand-knockout': styles.colorBrandKnockout,
  knockout: styles.colorKnockout,
  disabled: styles.colorDisabled,
  'utility-error': styles.colorUtilityError,
  'utility-warning': styles.colorUtilityWarning,
  'utility-success': styles.colorUtilitySuccess,
  'utility-info': styles.colorUtilityInfo
}

const defaultElementMap: Record<TypographyVariant, React.ElementType> = {
  'display-default': 'h1',
  'display-sm': 'p',
  'headline-lg': 'h1',
  'headline-default': 'h2',
  'headline-sm': 'h3',
  'title-lg': 'h3',
  'title-default': 'h4',
  'title-sm': 'h5',
  'label-lg': 'span',
  'label-default': 'span',
  'label-sm': 'span',
  'body-lg': 'p',
  'body-default': 'p',
  'body-sm': 'p',
  'meta-default': 'span',
  'meta-sm': 'span'
}

export default function Typography<C extends React.ElementType = 'p'>({
  variant = 'body-default',
  color = 'default',
  component,
  className,
  ...rest
}: TypographyProps<C>) {
  const Component = component ?? defaultElementMap[variant]

  return (
    <Component
      className={clsx(
        styles.typography,
        variantClassNames[variant],
        colorClassNames[color],
        className
      )}
      {...rest}
    />
  )
}
