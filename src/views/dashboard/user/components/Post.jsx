import React from "react";
import { Card, Button } from "react-bootstrap";

const Post = () => {

    const handlePost = ( ) => {
        console.log("Pressed Post")
    }
  return (
    <Card className="h-100">
      <Card.Header>
        <div className="d-flex justify-content-start align-items-center fs-4">
          <i className="fas fa-chart-area me-2" />
          <h4>User's Post</h4>
        </div>
      </Card.Header>
      <Card.Body>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
          placeholder="I had an interesting experience today that I wanted to share ..."
        ></textarea>
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item active">Directly Post on LinkedIn</li>
        </ol>
        <div className="d-flex justify-content-end">
          <Button className="w-25" onClick={handlePost}>Post</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Post;
