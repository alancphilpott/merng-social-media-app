import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Button, Form } from "semantic-ui-react";

import { useForm } from "../util/hooks";

function PostForm() {
    const [errors, setErrors] = useState({});

    const { values, onChange, onSubmit } = useForm(createPostCallback, {
        body: ""
    });

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(_, result) {
            console.log(result);
            values.body = "";
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    });

    function createPostCallback() {
        createPost();
    }

    return (
        <Form onSubmit={onSubmit}>
            <h2>Create A Post: </h2>
            <Form.Field>
                <Form.Input
                    placeholder="What's On Your Mind?..."
                    name="body"
                    onChange={onChange}
                    value={values.body}
                    error={errors.body ? true : false}
                />
                <Button type="submit" color="blue">
                    Submit
                </Button>
            </Form.Field>
        </Form>
    );
}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!) {
        createPost(body: $body) {
            id
            body
            createdAt
            username
            likeCount
            likes {
                id
                username
                createdAt
            }
            commentCount
            comments {
                id
                body
                username
                createdAt
            }
        }
    }
`;

export default PostForm;
