import 'reflect-metadata';

export class Type {
  public extractFieldsToJson<T>(type: new () => T): { [key: string]: boolean } {
    const fields: { [key: string]: boolean } = {};

    const propertyNames = Object.getOwnPropertyNames(new type());

    for (const prop of propertyNames) {
      const metadata = Reflect.getMetadata('design:type', new type(), prop);
      if (metadata) {
        fields[prop] = true;
      }
    }

    return fields;
  }
}
