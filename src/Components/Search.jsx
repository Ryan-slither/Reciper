import "./Search.css";
import PropTypes from "prop-types";

function Search(props) {
  const handleChange = (event) => {
    props.onChange(event.target.value);
  };
  return (
    <>
      <div className={props.short ? "SearchContainerShort" : "SearchContainer"}>
        <div className="SearchHeader">{props.header}</div>
        <input
          className={props.short ? "SearchShort" : "SearchLong"}
          placeholder={props.placeholder}
          value={props.value}
          name={props.name}
          onChange={handleChange}
        />
      </div>
    </>
  );
}

Search.propTypes = {
  header: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  short: PropTypes.bool,
};

export default Search;
