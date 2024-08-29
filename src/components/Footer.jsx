import InputEmoji from "react-input-emoji";

const Footer = ({ text, setText, cleanData, handleKeyDown, handleSubmit }) => {
  return (
    <form
      className="footer h-28 flex items-center p-2 bg-white border border-t-2 rounded-b-md"
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
