import clsx from 'clsx'

import styles from './index.module.css'

export type TypographyVariant =
  | 'display-sm'
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

export type TypographyColor = 'brand' | 'subtle' | 'knockout' | 'utility-error' | 'utility-success'

export type TypographyProps<C extends React.ElementType = 'p'> = {
  variant?: TypographyVariant
  color?: TypographyColor
  component?: C
} & Omit<React.ComponentPropsWithoutRef<C>, 'color' | 'component' | 'variant'>

const variantClassNames: Record<TypographyVariant, string | undefined> = {
  'display-sm': styles.displaySm,
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
  brand: styles.colorBrand,
  subtle: styles.colorSubtle,
  knockout: styles.colorKnockout,
  'utility-error': styles.colorUtilityError,
  'utility-success': styles.colorUtilitySuccess
}

const defaultElementMap: Record<TypographyVariant, React.ElementType> = {
  'display-sm': 'p',
  'headline-default': 'h1',
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
  color = 'brand',
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
