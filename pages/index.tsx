import React, { useState, useEffect } from 'react';
import Head from "next/head";
import TextField from '@mui/material/TextField';
import styles from "./index.module.css"
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import { gql, useQuery, useMutation, } from "@apollo/client";

import { RowField } from '../components';


const AllPromptsQuery = gql`
  query {
    prompts {
      id
      title
      suggestion
      thumbDown
      rank
    }
  }
`;


const CREATE_PROMPT_MUTATION = gql`
 mutation ($createPromptContent: [PromptObjectType!]!) {
  CreatePrompt(content: $createPromptContent) {
    id
    title
    suggestion
    thumbDown
    rank
  }
}
`;

const UPDATE_PROMPT_MUTATION = gql`
mutation($content: UpdatePromptObjectType!){
  UpdatePrompt(content: $content) {
    id
    suggestion
    title
    rank
    thumbDown
    createdAt
    updatedAt
  }
}
`


export default function Home() {
  const { data, error, loading } = useQuery(AllPromptsQuery);
  const [mutateFunction, {
    data: mutationData,
    loading: mutationLoading,
    error: mutationError }] = useMutation(CREATE_PROMPT_MUTATION, {
      refetchQueries: [
        { query: AllPromptsQuery }, // DocumentNode object parsed with gql
        'prompts' // Query name
      ],
    });
  const [updateFunction, {
    data: updateData,
    loading: updateLoading,
    error: updateError
  }] = useMutation(UPDATE_PROMPT_MUTATION)


  const [promptInput, setPromptInput] = useState("");
  const [currentText, setCurrentText] = useState({ id: "", text: "" });
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState([]);
  const [currentRank, setCurrentRank] = useState(
    { 1: '1', 2: "2", 3: "3" })
  const [activateDisable, setActivateDisabled] = useState({
    1: true,
    2: true,
    3: true
  })

  if (loading) return <p>loading....</p>

  if (error) return <p>Opps, something went wrong {error.message}</p>



  const createData = async (data) => {
    const saved = await mutateFunction({
      variables: {
        createPromptContent: data
      }
    });
    console.log(saved?.data?.CreatePrompt, "the saved======")
    setResult(saved?.data?.CreatePrompt);
  }

  const updatePromptData = async (data) => {
    const saved = await updateFunction({
      variables: {
        content: data
      }
    });
    console.log(saved?.data, "the updated======")
  }


  async function onSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    setResult([]);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: promptInput }),
      });

      const data = await response.json();

      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      const results = data.result

      setPromptInput("");
      setIsLoading(false)
      const formattedResult = []
      for (var k in results) {
        const obj = {
          title: promptInput,
          suggestion: results[k].text,
          thumbDown: false,
          rank: parseInt(k) + parseInt(1)
        }
        formattedResult.push(obj)
      }
      const createPrompts = await createData(formattedResult)

    } catch (error) {
      // Consider implementing your own error handling logic here
      console.log(JSON.stringify(error));
      alert(error.message);
      setIsLoading(false)
    }
  }



  const addRank = async (index: number, rank: string, id: string) => {
    const currentPosition = index + 1
    const currentRankDup = currentRank
    const keys = Object.keys(currentRank);
    const updatePrompts = await updatePromptData({
      id, data: {
        rank: parseInt(rank)
      }
    })


    keys.forEach((key, index) => {
      if (currentRankDup[key] === rank) {
        currentRankDup[key] = currentRankDup[key] === "3" ? "1" : parseInt(currentRankDup[key]) + 1

      }
    })
    setCurrentRank({ ...currentRankDup, [currentPosition]: rank })
    setActivateDisabled({ ...activateDisable, [currentPosition]: false })
  }

  const showRank = (index: number, rank: string): boolean => {
    return currentRank[index + 1] === rank
  }

  const handleForm = async (evt, id) => {
    const updatePrompts = await updatePromptData({
      id, data: {
        suggestion: evt.target.value
      }
    })
    console.log(updatePrompts, "===d====")
    setCurrentText({ id, text: evt.target.value })
  };

  const saveEdit = async (id: string) => {
    const updatePrompts = await updatePromptData({
      id, data: {
        suggestion: (currentText.text)
      }
    })
    console.log(updatePrompts)
  }

  const thumbsDown = async (id: string) => {
    const updatePrompts = await updatePromptData({
      id, data: {
        thumbDown: false
      }
    })
    console.log(updatePrompts)
  }


  return (
    <div className={styles.main_body}>
      <Head>
        <title>Turing Test</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.prompt_container}>
        <form onSubmit={onSubmit} className={styles.form}>
          <TextField
            required
            id="outlined-required"
            label="Prompt"
            defaultValue="Enter Prompt"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            className={styles.textField}
          />

          <div className={styles.btn_generate}>
            <LoadingButton loading={isLoading} loadingIndicator="Submitting" variant="contained" color="success" size="large" onClick={() => onSubmit()}>
              Generate
            </LoadingButton>
          </div>
        </form>

        {result.map((data, index) => (
          <RowField
            title={`Sample ${index + 1}`}
            isLoading={false}
            fieldDisabled={activateDisable[index + 1]}
            value={data.suggestion}
            key={index}
            rankOneClick={() => addRank(index, "1", data.id)}
            rankTwoClick={() => addRank(index, "2", data.id)}
            rankThreeClick={() => addRank(index, "3", data.id)}
            firstSelection={showRank(index, "1")}
            secondSelection={showRank(index, "2")}
            thirdSelection={showRank(index, "3")}
            saveEdit={() => saveEdit(data.id)}
            thumbsDownClick={() => thumbsDown(data.id)}
            handleForm={(evt) => handleForm(evt, data.id)} />

        ))}



      </div>
    </div>
  );
}
