const EditProfile = () => {
  return (
    <div>
      <input
        type="file"
        onChange={() => {
          console.log("obj selected");
        }}
      />
      <button
        onClick={() => {
          console.log("clicked");
        }}
      >
        Upload Profile Picture
      </button>
    </div>
  );
};

export default EditProfile;
