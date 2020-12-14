import React, { useState } from "react";
import { Button, Form } from 'semantic-ui-react';
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { useForm } from '../utils/hooks';
import { FETCH_POST_QUERY } from "../utils/graphql";

function PostForm() {
    const [errors, setErrors] = useState({});

    const { values, onChange, onSubmit } = useForm(createPostCallback, {
        body: ''
    });


    const [createPost] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result) {

            const data = proxy.readQuery({
                query: FETCH_POST_QUERY
            })



            proxy.writeQuery({
                query: FETCH_POST_QUERY,
                data: {
                    getPosts: [result.data.createPost, ...data.getPosts]
                }
            })

            values.body = "";
        },
        onError: (err) => {
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        }
    })



    function createPostCallback() {
        createPost();
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create a post:</h2>
                <Form.Field>
                    <Form.Input
                        placeholder="Hi World!"
                        name="body"
                        onChange={onChange}
                        error={errors.body ? true : false}
                        value={values.body}
                    />
                    <Button type="submit" color="teal">
                        Submit
            </Button>
                </Form.Field>
            </Form>
            {

                errors.body && (
                    <div className="ui error message" style={{ marginBottom: 20 }}>
                        <ul className="list">
                            <li>{errors.body}</li>
                        </ul>
                    </div>
                )
            }
        </>
    );

}

const CREATE_POST_MUTATION = gql`

mutation CreatePost($body : String!) {
    createPost(body: $body){
        id
        body
        username
        createdAt
        comments { 
            id
            createdAt
            username
            body

        }
        likes {
            id
            createdAt
            username
        }
        likeCount
        commentCount
    }
}

`;

export default PostForm;