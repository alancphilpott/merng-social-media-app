import React, { useContext } from "react";
import { gql, useQuery } from "@apollo/client";
import { Card, Grid, Icon, Image, Button, Label } from "semantic-ui-react";
import moment from "moment";

import LikeButton from "../components/LikeButton";
import { AuthContext } from "../context/auth";

function SinglePost(props) {
    const postId = props.match.params.postId;

    const { user } = useContext(AuthContext);

    const { data } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    });

    let postMarkup;

    if (!data.getPost) {
        postMarkup = <p>Loading Post...</p>;
    } else {
        const {
            id,
            body,
            createdAt,
            username,
            comments,
            likes,
            likeCount,
            commentCount
        } = data.getPost;

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                            size="small"
                            float="right"
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>
                                    {moment(createdAt).fromNow()}
                                </Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <LikeButton
                                    user={user}
                                    post={{ id, likeCount, likes }}
                                />
                                <Button
                                    as="div"
                                    labelPosition="right"
                                    onClick={() =>
                                        console.log("Comment On Post...")
                                    }
                                />
                                <Button basic color="blue">
                                    <Icon name="comments" />
                                </Button>
                                <Label basic color="blue" pointing="left">
                                    {commentCount}
                                </Label>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
    return postMarkup;
}

const FETCH_POST_QUERY = gql`
    query($postId: ID!) {
        getPost(postId: $postId) {
            id
            body
            createdAt
            username
            likeCount
            likes {
                username
            }
            commentCount
            comments {
                id
                username
                createdAt
                body
            }
        }
    }
`;

export default SinglePost;
