describe("snapshot", function () {
   it("restoring snapshot resets all properties to the values they had when the snapshot was taken", function () {
       
       var referencedObject = { x: 3 };
       var obj = { a: 1, b: 2, c: referencedObject };

       gosu.snapshot.extend(obj);

       obj.snapshot();

       obj.a = 3;
       obj.b = 5;
       obj.c = {};

       obj.restoreSnapshot();

       expect(obj.a).toEqual(1);
       expect(obj.b).toEqual(2);
       expect(obj.c).toEqual(referencedObject);
   });
});
