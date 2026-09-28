import { Layout } from "../ui/Layout";
import { mount } from "../ui/mount";

function Community() {
  return (
    <Layout page="repository">
      <h1>Community</h1>
      <p>
        Open-source models from the nodd community, hosted on Hugging Face.
        Download, reuse, and adapt them for your own projects, or submit your own model to the catalog.
      </p>
      <p>These small models can be trained on modest hardware using a CPU, without a dedicated GPU.</p>
      <p>
        <a href="https://huggingface.co/spaces/nodd-repo/community">Browse the community catalog on Hugging Face →</a>
      </p>
    </Layout>
  );
}

mount(<Community />);
