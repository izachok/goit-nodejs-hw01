const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.resolve(__dirname, "./db/contacts.json");

async function listContacts() {
  const contacts = await getContactsFromFile();
  console.table(contacts);
}

async function getContactById(contactId) {
  const id = parseInt(contactId);
  if (isNaN(id)) {
    console.log("Id shoud be integer.");
    return;
  }

  const contacts = await getContactsFromFile();
  const contact = contacts.find((contact) => contact.id === id);
  if (contact) {
    console.table(contact);
  } else {
    console.log("No contact was found.");
  }
}

async function removeContact(contactId) {
  const id = parseInt(contactId);
  if (isNaN(id)) {
    console.log("Id shoud be integer.");
    return;
  }

  const contacts = await getContactsFromFile();
  await saveContactsToFile(
    contacts.filter((contact) => contact.id !== contactId)
  );
  listContacts();
}

async function addContact(name, email, phone) {
  if (!name || !email || !phone) {
    console.log("Name, email and phone are required.");
    return;
  }

  const contacts = await getContactsFromFile();
  const newContact = { id: getNextId(contacts), name, email, phone };
  contacts.push(newContact);
  await saveContactsToFile(contacts);
  listContacts();
}

async function getContactsFromFile() {
  try {
    const result = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(result);
  } catch (error) {
    console.error("Error occured: ", error);
  }
}

async function saveContactsToFile(contacts) {
  try {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf8");
  } catch (error) {
    console.error("Error occured: ", error);
  }
}

function getNextId(contacts) {
  let id = 0;
  if (contacts) {
    contacts.forEach((contact) => (id = contact.id > id ? contact.id : id));
  }
  return id + 1;
}

module.exports = { listContacts, getContactById, removeContact, addContact };
