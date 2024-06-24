import React from 'react'
import {joinClasses} from '../../libs'
import styles from './Button.module.css'

type Props = {
    onClick: (e: React.MouseEvent) => void,
    children: string,
    disabled?: boolean,
    className?: string,
}

const Button = (props: Props) =>
	<button {...props} className={joinClasses(styles.button, props.className)} ></button>

export {
	Button,
}