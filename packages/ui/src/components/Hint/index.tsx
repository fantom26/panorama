import Typography from '@/components/Typography'

export type HintProps = {
  error?: boolean
  text: string
}

export default function Hint({ error, text }: HintProps) {
  return (
    <Typography component='span' variant='meta-sm' color={error ? 'utility-error' : 'subtle'}>
      {text}
    </Typography>
  )
}
