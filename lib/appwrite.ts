import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

import { config } from "@/protection/config";

type createUserProps = {
  email: string;
  password: string;
  username: string;
};

export interface FileProps {
  fileName: string;
  mimeType: string;
  fileSize: number;
  uri: string;
}

interface VideoFormProps {
  title: string;
  video?: FileProps | null;
  thumbnail?: FileProps | null;
  prompt: string;
  userId: string;
}

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Register User
export async function createUser({
  email,
  password,
  username,
}: createUserProps): Promise<any> {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error();

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error: unknown) {
    console.error("An unexpected error occurred:", error);
    throw new Error(String(error));
  }
}

// Login User
export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    throw new Error(String(error));
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    throw new Error(String(error));
  }
}

// Get Current User
export async function getCurrentUser(): Promise<any | null> {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw new Error("No current account found");

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (
      !currentUser ||
      !currentUser.documents ||
      currentUser.documents.length === 0
    ) {
      return null;
    }
    return currentUser.documents[0];
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// Get all video Posts
export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// Get latest video Posts
export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// Get Search Posts
export async function searchPosts(query: string): Promise<any[]> {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.search("title", query)]
    );
    if (!posts) throw new Error("Something Went Wrong");
    return posts.documents;
  } catch (error) {
    throw new Error(String(error));
  }
}

// Get User Posts
export async function getUserPosts(userId?: string) {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal("Creator", userId), Query.orderDesc("$createdAt")]
    );
    if (!posts) throw new Error("Something Went Wrong");
    return posts.documents;
  } catch (error) {
    throw new Error(String(error));
  }
}

// Logout
export async function signOut() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(String(error));
  }
}

// Get File Preview
export async function getFilePreview(
  fileId: string,
  type: string
): Promise<string | URL> {
  let fileUrl;

  try {
    switch (type) {
      case "video":
        fileUrl = storage.getFileView(config.storageId, fileId);
        break;
      case "image":
        fileUrl = storage.getFilePreview(
          config.storageId,
          fileId,
          2000,
          2000,
          "top",
          100
        );
        break;
      default:
        throw new Error(`Unsupported file type: ${type}`);
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(String(error));
  }
}

// Upload File
export async function uploadFile(
  file: FileProps,
  type: string
): Promise<string> {
  if (!file) {
    throw new Error("File is required");
  }

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl.toString();
  } catch (error) {
    throw new Error(String(error));
  }
}

// Create Video
export async function createVideo(form: VideoFormProps): Promise<any> {
  if (
    !form ||
    !form.thumbnail ||
    !form.video ||
    !form.title ||
    !form.prompt ||
    !form.userId
  ) {
    throw new Error("Invalid form data");
  }

  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      config.databaseId,
      config.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        Creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(String(error));
  }
}
