import docs_modal from "../schemas/document.js";

const get_user_all_docs_controller = async (req, res, next) => {
  try {
    const user = req.user;

    const all_docs = await docs_modal
      .find({
        $or: [
          {
            owner_id: user._id,
          },
          {
            joinedUsers: {
              $in: [user._id],
            },
          },
        ],
      })
      .populate({
        path: "owner_id joinedUsers",
        select: "-password", // Exclude the password field
      });
    res.status(200).json({ message: "all_docs", all_docs });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const findByIdOrCreate = async (id, user) => {
  console.log(user);
  try {
    if (!id) return;

    if (id.length == 36) {
      const get_doc = await docs_modal.findById(id);

      if (!get_doc) {
        const doc = await docs_modal.create({
          _id: id,
          name: "Untitled Document",
          owner_id: user._id,
          data: "",
          joinedUsers: [],
        });
        return doc;
      }

      if (get_doc.owner_id != user._id) {
        if (!get_doc.joinedUsers.includes(user._id)) {
          get_doc.joinedUsers.push(user._id);

          await get_doc.save();
        }
      }
      return get_doc;
    } else {
      throw new Error("Not Found");
    }
  } catch (error) {
    console.log(error);
    // throw new Error(error);
  }
};

const update_doc_data = async (id, data) => {
  try {
    if (!id) return;

    const updatedDocument = await docs_modal.findOneAndUpdate(
      { _id: id },
      { data },
      { new: true }
    );

    console.log("*****************Updated Document****************");
    return updatedDocument;
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error");
  }
};

const update_doc_name = async (req, res, next) => {
  const { id, name } = req.body || {};
  try {
    if (!id) {
      return res.status(400).json({ message: "Not Found" });
    }

    const updatedDocument = await docs_modal.findOneAndUpdate(
      { _id: id },
      { name },
      { new: true }
    );

    if (updatedDocument) {
      return res.status(200).json({ data: updatedDocument });
    } else {
      return res.status(404).json({ message: "Document not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error " });
  }
};

const delete_document = async (req, res) => {
  const { id } = req.params || {};
  const { user } = req;
  if (!id) return;

  try {
    const document = await docs_modal.findById(id);

    if (document) {
      if (`${document.owner_id._id}` == user._id) {
        console.log("Entering");
        const remove_document = await docs_modal.findByIdAndDelete(id);

        if (remove_document) {
          return res.status(200).json({
            message: "Document deleted successfully",
            id: remove_document._id,
          });
        }
      }
    } else {
      return res.status(404).json({ message: "Document not found" });
    }
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  get_user_all_docs_controller,
  findByIdOrCreate,
  update_doc_data,
  update_doc_name,
  delete_document,
};
