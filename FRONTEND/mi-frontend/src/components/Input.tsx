interface Props extends React.InputHTMLAttributes<HTMLInputElement>{}
const Input = (props: Props) => {[]
  return (

    <input
        className="
                      h-8 w-[65%] rounded pl-2.5 text-sm outline-none transition-all
                    bg-white/40 border-2 border-[rgb(166,216,219)] text-slate-900
                    placeholder:text-slate-500 placeholder:italic
                    hover:bg-white/60 hover:border-[rgb(129,178,180)]
                    focus:bg-white/60 focus:border-[rgb(129,178,180)]
                      hover:shadow-[0_0_8px_rgba(166,216,219,0.3)]
                      focus:shadow-[0_0_8px_rgba(166,216,219,0.5)]
                  "
        {...props}     
    />
  )
}

export default Input