import React from 'react';
import styles from "./styles.module.css";

const CircleButton = ({ text, onClick, isSelected }) => {
    return (
        <div className={styles.circle} onClick={() => onClick()}
            style={{ backgroundColor: isSelected?"green":"transparent"}}>
            {text}
        </div>
    )
}

export default CircleButton;