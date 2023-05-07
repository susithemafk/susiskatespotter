import React from 'react';
import styles from './Button.module.scss';

function Button(props) {
    const { variant, children, className, ...rest } = props 
    
    let variantStyles = styles.primary
    let loading = ''

    switch (variant) {

        case 'primary loading':
          variantStyles = styles.primary 
          loading = styles.loading
          break;
        case 'primary':
          variantStyles = styles.primary
          break;

        case 'secondary loading':
          variantStyles = styles.secondary
          loading = styles.loading
          break;
        case 'secondary':
          variantStyles = styles.secondary
          break;

        case 'outline loading':
          variantStyles = styles.outline
          loading = styles.loading
          break;
        case 'outline':
          variantStyles = styles.outline
          break; 
        case 'rounded':
          variantStyles = styles.rounded
          break; 
        case 'white':
          variantStyles = styles.white
          break; 
        case 'red loading':
          variantStyles = styles.red
          loading = styles.loading
          break; 
        case 'red':
          variantStyles = styles.red
          break; 
        case 'dark':
          variantStyles = styles.dark
          break; 
          
        default:
          variantStyles = styles.primary
    }


    return (
        <button className={`${styles.button} ${variantStyles} ${loading} ${props.className}`} {...rest}>
            {children}
        </button>
    );
}

export default Button