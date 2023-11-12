import Dropdown from "react-bootstrap/Dropdown";
import DropdownMenu from "react-bootstrap/DropdownMenu";
export default function Profile(props) {
  const signOutHandler = () => {
    props.signOut();
  };
  return (
    <div>
      <Dropdown className="custom-dropdown">
        <Dropdown.Toggle
          className="custom-dropdown-toggle"
          id="profile-dropdown"
        >
          {props.user.firstName}
        </Dropdown.Toggle>
        {props.isDashboard ? (
          <Dropdown.Menu className="custom-dropdown-menu">
            <Dropdown.Divider />
            <Dropdown.Item onClick={signOutHandler} href="/signin">
              SignOut
            </Dropdown.Item>
          </Dropdown.Menu>
        ) : (
          <DropdownMenu>
            <Dropdown.Item href="/dashboard">dashboard</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={signOutHandler} href="/signin">
              SignOut
            </Dropdown.Item>
          </DropdownMenu>
        )}
      </Dropdown>
    </div>
  );
}
