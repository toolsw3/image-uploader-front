import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { VechaiProvider, Button, Image, Input  } from "@vechaiui/react";

const fileTypes = ["JPG", "PNG", "GIF"];

function App() {
  const [files, setFiles] = useState([]);
  const [password, setPassword] = useState('')

  const handleChange = async (file) => {
    const formData = new FormData();

    formData.append("file", file);

    const url = await fetch(`${process.env.REACT_APP_API_URL}/upload`, {
      method: "POST",
      headers: {
        'password':`${password}`
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.status === "OK") return json.url;
        alert(json.status)
      });

    if (url) setFiles(files.concat({ name: file.name, url: url }));
  };

  return (
    <VechaiProvider>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          margin: "10px",
          gap: "10px",
        }}
      >
        <div>
        <div className="flex flex-col w-full p-8 space-y-4">
          <Input placeholder="password" type='password' value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        </div>
        <div style={{ backgroundColor: "white", borderRadius: "5px" }}>
          <FileUploader
            handleChange={handleChange}
            name="file"
            types={fileTypes}
          />
        </div>
        <div>
          <h1>Files uploaded</h1>
        </div>
        <div
          style={{
            width: "500px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {files.map((file, index) => (
            <div
              key={index}
              style={{ display: "flex", flexDirection: "row", gap: "10px" }}
            >
              <div>
                <Image src={file.url}></Image>
                <div>{file.name}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <Button
                  color="primary"
                  onClick={() => {
                    navigator.clipboard.writeText(file.url);
                  }}
                >
                  Copy link address
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `![${file.name}](${file.url})`
                    );
                  }}
                >
                  Copy markdown image
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "20px",
        }}
      >
        <Button
          color="primary"
          variant="solid"
          onClick={() => {
            setFiles([]);
          }}
        >
          Clear
        </Button>
      </div>
    </VechaiProvider>
  );
}

export default App;
