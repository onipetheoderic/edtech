import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import styles from "./styles.module.css";
import CircleButton from "../components/CircleButton";
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons'

interface IRowField {
    isLoading: boolean;
    value: string;
    title: string;
    rankOneClick: () => void;
    rankTwoClick: () => void;
    rankThreeClick: () => void;
    thumbsDownClick: () => void;
    saveEdit: () => void;
    firstSelection: boolean;
    secondSelection: boolean;
    thirdSelection: boolean;
    fieldDisabled: boolean;
    handleForm: (evt: any) => void;
}

const RowField = ({
    isLoading,
    value,
    title,
    rankOneClick,
    rankTwoClick,
    rankThreeClick,
    thumbsDownClick,
    saveEdit,
    firstSelection,
    secondSelection,
    fieldDisabled = true,
    thirdSelection,
    handleForm }: IRowField) => {
    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={8} md={8}>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '100%' },
                    }}>
                    <TextField
                        id="outlined-multiline-static"
                        label={title}
                        multiline
                        disabled={fieldDisabled}
                        rows={4}
                        defaultValue={value}
                        onChange={handleForm}
                    />
                </Box>
            </Grid>
            <Grid item xs={4} md={4}>
                <Grid direction="row" container alignItems="center">
                    <CircleButton text={1} onClick={() => rankOneClick()} isSelected={firstSelection} />
                    <CircleButton text={2} onClick={() => rankTwoClick()} isSelected={secondSelection} />
                    <CircleButton text={3} onClick={() => rankThreeClick()} isSelected={thirdSelection} />
                    <div onClick={() => thumbsDownClick()} className={styles.thumb}>
                        <FontAwesomeIcon icon={faThumbsDown} fontSize={40} />
                    </div>
                </Grid>
                <div className={styles.btn}>
                    <LoadingButton loading={isLoading} variant="contained" color="success" size="large" onClick={() => saveEdit()}>
                        Save Edits
                    </LoadingButton>
                </div>
            </Grid>
        </Grid>

    )
}

export default RowField;