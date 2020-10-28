import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Grid, Transition } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function Home() {
    const { loading, _, data } = useQuery(FETCH_POSTS_QUERY);

    const { user } = useContext(AuthContext);

    return (
        <Grid columns={3}>
            <Grid.Row className="page-title">
                {user ? (
                    <h1>Welcome {capitalizeFirstLetter(user.username)}</h1>
                ) : (
                    <h1>Welcome!</h1>
                )}
            </Grid.Row>
            <Grid.Row>
                {user && (
                    <Grid.Column>
                        <Transition.Group duration={200}>
                            <PostForm />
                        </Transition.Group>
                    </Grid.Column>
                )}
            </Grid.Row>
            <Grid.Row>
                {loading ? (
                    <h1>Loading Posts...</h1>
                ) : (
                    <Transition.Group duration={500}>
                        {data.getPosts &&
                            data.getPosts.map((post) => (
                                <Grid.Column
                                    key={post.id}
                                    style={{ marginBottom: 40 }}
                                >
                                    <PostCard post={post} />
                                </Grid.Column>
                            ))}
                    </Transition.Group>
                )}
            </Grid.Row>
        </Grid>
    );
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default Home;
