import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormControl, FormLabel } from "@mui/material";
import Form from "react-bootstrap/Form";
export default function ViewComponent(props) {
  return (
    <div className="view-body">
      <div
        onClick={() => {
          props.setShowView(false);
        }}
        className="view-close"
      >
        <FontAwesomeIcon icon={faXmark} />
      </div>
      <Form className=" mb-4 d-flex flex-column">
        <Form.Group className="ms-4 mt-4">
          <FormLabel
            style={{ fontWeight: "bold", color: "black", marginRight: "1rem" }}
          >
            Task Name:
          </FormLabel>
          <FormControl as="data">{props.taskView.taskName}</FormControl>
        </Form.Group>
        <Form.Group className="ms-4 mt-4">
          <FormLabel
            style={{ fontWeight: "bold", color: "black", marginRight: "1rem" }}
          >
            Task Description:
          </FormLabel>
          <FormControl
            style={{
              width: "30rem",
              height: "auto",
              border: "2px solid black",
              textAlign: "fit-content",
              borderRadius: "5px",
            }}
            as="data"
          >
            {props.taskView.taskDescription}
          </FormControl>
        </Form.Group>
        <Form.Group className="ms-4 mt-4">
          <FormLabel
            style={{ fontWeight: "bold", color: "black", marginRight: "1rem" }}
          >
            Task Category:
          </FormLabel>
          <FormControl as="data">{props.taskView.taskCategory}</FormControl>
        </Form.Group>
        <Form.Group className="ms-4 mt-4">
          <FormLabel
            style={{ fontWeight: "bold", color: "black", marginRight: "1rem" }}
          >
            Email remainder:
          </FormLabel>
          <FormControl as="data">{props.taskView.remainderEmail}</FormControl>
        </Form.Group>
        <Form.Group className="ms-4 mt-4">
          <FormLabel
            style={{ fontWeight: "bold", color: "black", marginRight: "1rem" }}
          >
            Created At:
          </FormLabel>
          <FormControl as="data">{props.taskView.createdAt}</FormControl>
        </Form.Group>
        <Form.Group className="ms-4 mt-4">
          <FormLabel
            style={{ fontWeight: "bold", color: "black", marginRight: "1rem" }}
          >
            Remainder Date:
          </FormLabel>
          <FormControl as="data">{props.taskView.remainderDate}</FormControl>
        </Form.Group>
        <Form.Group className="ms-4 mt-4">
          <FormLabel
            style={{ fontWeight: "bold", color: "black", marginRight: "1rem" }}
          >
            Remainder Time:
          </FormLabel>
          <FormControl as="data">{props.taskView.remainderTime}</FormControl>
        </Form.Group>
      </Form>
    </div>
  );
}
