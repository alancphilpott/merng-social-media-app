import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Button, Icon, Confirm } from "semantic-ui-react";

import { FETCH_POSTS_QUERY } from "../util/graphql";

function DeleteButton({ postId, callback }) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const [deletePost] = useMutation(DELETE_POST_MUTATION, {
        update(proxy) {
            setConfirmOpen(false);
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                    getPosts: data.getPosts.filter((p) => p.id !== postId)
                }
            });

            if (callback) callback();
        },
        variables: {
            postId
        }
    });

    return (
        <>
            <Button
                className="ui icon button"
                floated="right"
                color="orange"
                onClick={() => setConfirmOpen(true)}
            >
                <Icon
                    name="trash alternate outline"
                    style={{ margin: 0 }}
                ></Icon>
            </Button>
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePost}
            />
        </>
    );
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!) {
        deletePost(postId: $postId)
    }
`;

export default DeleteButton;
