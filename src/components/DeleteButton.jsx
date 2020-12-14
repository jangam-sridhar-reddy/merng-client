import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Button, Icon, Confirm, Popup } from "semantic-ui-react";


import { FETCH_POST_QUERY } from "../utils/graphql";

function DeleteButton({ postId, commentId, callback }) {

    const [confirmopen, setConfirmOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT : DELETE_POST

    const [deletePostOrComment] = useMutation(mutation, {
        variables: {
            postId,
            commentId
        },
        update(proxy) {
            setConfirmOpen(false);
            if (!commentId) {
                const data = proxy.readQuery({
                    query: FETCH_POST_QUERY
                })

                const newData = data.getPosts.filter(p => p.id !== postId)

                proxy.writeQuery({
                    query: FETCH_POST_QUERY,
                    data: {
                        getPosts: newData
                    }
                })
            }



            if (callback) {
                callback();
            }
        }
    })


    return (
        <>
            <Popup inverted content={`Delete ${commentId ? "commnet" : "post"}`} trigger={
                <Button as="div" color="red" floated="right" onClick={() => setConfirmOpen(true)}>
                    <Icon name="trash" style={{ margin: 0 }} />
                </Button>} />
            <Confirm open={confirmopen} onCancel={() => setConfirmOpen(false)} onConfirm={deletePostOrComment} />
        </>
    )

}


const DELETE_POST = gql`
    mutation DeletePost($postId: ID!) {
        deletePost(postId: $postId)
    }
`;

const DELETE_COMMENT = gql`
    mutation DeleteComment($postId : ID!, $commentId : ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            id
            comments {
                id
                username
                createdAt
                body
            }
            commentCount
            
        }
    }
`;

export default DeleteButton;