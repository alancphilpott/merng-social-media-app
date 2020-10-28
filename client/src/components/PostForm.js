import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Button, Form } from "semantic-ui-react";

import { useForm } from "../util/hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function PostForm() {
    const [errors, setErrors] = useState({});

    const { values, onChange, onSubmit } = useForm(createPostCallback, {
        body: ""
    });

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                    getPosts: [result.data.createPost, ...data.getPosts]
                }
            });
            values.body = "";
        },
        onError(err) {
            return err;
        }
    });

    function createPostCallback() {
        createPost();
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create A Post: </h2>
                <Form.Field>
                    <Form.Input
                        placeholder="What's On Your Mind?..."
                        name="body"
                        onChange={onChange}
                        value={values.body}
                        error={error ? true : false}
                    />
                    <Button type="submit" color="blue">
                        Submit
                    </Button>
                </Form.Field>
            </Form>
            {error && (
                <div className="ui error message">
                    <ul className="list">
                        <li>{error.graphQLErrors[0].extensions.errors.post}</li>
                    </ul>
                </div>
            )}
        </>
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
