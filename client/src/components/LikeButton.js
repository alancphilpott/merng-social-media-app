import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Label, Icon } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";

import MyPopup from "../util/MyPopup";

function LikeButton({ user, post: { id, likes, likeCount } }) {
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (user && likes.find((like) => like.username === user.username)) {
            setLiked(true);
        } else setLiked(false);
    }, [user, likes]);

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id }
    });

    const likeButton = user ? (
        liked ? (
            <Button color="blue">
                <Icon name="heart" />
            </Button>
        ) : (
            <Button basic color="blue">
                <Icon name="heart" />
            </Button>
        )
    ) : (
        <Button as={Link} to={"/login"} basic color="blue">
            <Icon name="heart" />
        </Button>
    );

    return user ? (
        <Button as="div" labelPosition="right" onClick={likePost}>
            <MyPopup content={liked ? "Unlike" : "Like"}>{likeButton}</MyPopup>
            <Label basic color="blue" pointing="left">
                {likeCount}
            </Label>
        </Button>
    ) : (
        <Button as="div" labelPosition="right">
            <MyPopup content={liked ? "Unlike" : "Like"}>{likeButton}</MyPopup>
            <Label basic color="blue" pointing="left">
                {likeCount}
            </Label>
        </Button>
    );
}

const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!) {
        likePost(postId: $postId) {
            id
            likes {
                id
                username
            }
            likeCount
        }
    }
`;

export default LikeButton;
