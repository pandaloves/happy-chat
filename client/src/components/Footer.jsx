import InputEmoji from "react-input-emoji";

const Footer = ({ text, setText, cleanData, handleKeyDown, handleSubmit }) => {
  return (
    <form
      className="sender h-20 flex items-center border-t-1 px-3 rounded-b-md"
      onSubmit={handleSubmit}
    >
      <InputEmoji
        className="textarea flex-1"
        placeholder="Type a message"
        cleanOnEnter
        value={cleanData(text)}
        onChange={setText}
        onKeyDown={handleKeyDown}
      />

      <button
        type="submit"
        className="btn btn-outline btn-sm btn-primary rounded-xl flex items-center justify-center"
      >
        <i className="fa-solid fa-paper-plane"></i>
      </button>
    </form>
  );
};

export default Footer;
