interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>{}

const ButtonForm = ({children , ...props}: Props) => {
  return (
        <button
            {...props}
        >
            {children}
        </button>
  )
}

export default ButtonForm