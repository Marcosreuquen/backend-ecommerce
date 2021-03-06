import { firestore } from "db/firestore";
const collection: FirebaseFirestore.CollectionReference =
  firestore.collection("orders");
import { airtableBase } from "db/airtable";

export class Order {
  static base = airtableBase;
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  id: string;
  constructor(id: string) {
    this.id = id;
    this.ref = collection.doc(id);
  }
  async pull(): Promise<void> {
    const snap = await this.ref.get();
    this.data = snap.data();
  }
  async push(): Promise<void> {
    this.ref.update(this.data);
  }
  static async createNewOrder(data: any): Promise<Order> {
    const newOrderSnap = await collection.add(data);
    const newOrder = new Order(newOrderSnap.id);
    newOrder.data = data;
    return newOrder;
  }
}
