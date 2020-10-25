import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, Image, Icon, Label } from "semantic-ui-react";
import moment from "moment";

function PostCard({
    post: { body, createdAt, id, username, likeCount, commentCount, likes }
}) {
    function likePost() {
        console.log("Like Post...");
    }

    function commentOnPost() {
        console.log("Commented...");
    }

    return (
        <Card fluid>
            <Card.Content>
                <Image
                    floated="right"
                    size="mini"
                    src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`}>
                    {moment(createdAt).fromNow(true)}
                </Card.Meta>
                <Card.Description>{body}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button as="div" labelPosition="right" onClick={likePost}>
                    <Button basic color="blue">
                        <Icon name="heart" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                        {likeCount}
                    </Label>
                </Button>
                <Button as="div" labelPosition="right" onClick={commentOnPost}>
                    <Button basic color="teal">
                        <Icon name="comments" />
                    </Button>
                    <Label basic color="teal" pointing="left">
                        {commentCount}
                    </Label>
                </Button>
            </Card.Content>
        </Card>
    );
}

export default PostCard;
