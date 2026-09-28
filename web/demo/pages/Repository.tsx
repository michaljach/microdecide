import { Layout } from "../ui/Layout";
import { mount } from "../ui/mount";

function Models() {
  return (
    <Layout page="repository">
      <h1>Models</h1>
      <p>
        Open-source models from the nodd community, hosted on Hugging Face.
        Download, reuse, and adapt them for your own projects.
      </p>
      <p>
        <a href="https://huggingface.co/nodd-repo">Browse community models on Hugging Face →</a>
      </p>
    </Layout>
  );
}

mount(<Models />);
