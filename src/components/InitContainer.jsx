const InitContainer = () => {
  return (
    <div className="flex justify-center items-center h-full text-white">
      <div className="flex flex-col justify-center items-center gap-2 text-slate-700">
        <i className="fa-solid fa-comments text-3xl"></i>

        <h2 className="text-xl font-bold">Welcome!</h2>
        <p className="text-lg">Select a user to start a conversation.</p>
      </div>
    </div>
  );
};

export default InitContainer;
