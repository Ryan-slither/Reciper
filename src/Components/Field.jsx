import { useState } from "react";
import "./Field.css";
import PropTypes from "prop-types";

function Field(props) {
  const [inputLength, setInputLength] = useState(0);
  const handleChange = (event) => {
    props.onChange(event.target.value);
    setInputLength(event.target.value.length);
  };

  return (
    <>
      <div className="LoginHeader">
        <span>{props.header}</span>
        <span className="LoginLength">{inputLength}</span>
      </div>
      <input
        className="LoginInput"
        type="text"
        placeholder={props.placeholder}
        value={props.value}
        name={props.name}
        onChange={handleChange}
      ></input>
    </>
  );
}

Field.propTypes = {
  header: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Field;
