import osiris from "./osiris engine";
import { makeDot } from "./osiris engine/modules/make";
import triangle from "./osiris engine/modules/triangle";

const t = tick()

print('test started')

const v3 = (x: number, y: number, z: number) => new Vector3(x, y, z);

const corners = [
    makeDot(new Vector3(0, 0, 0)),
    makeDot(new Vector3(0, 0, 10)),
    makeDot(new Vector3(0, 10, 0)),
    makeDot(new Vector3(0, 10, 10)),
    makeDot(new Vector3(10, 0, 0)),
    makeDot(new Vector3(10, 0, 10)),
    makeDot(new Vector3(10, 10, 0)),
    makeDot(new Vector3(10, 10, 10)),
]

const mesh = osiris.createMesh([
    //front
    [v3(0, 0, 10), v3(0, 10, 10), v3(10, 10, 10)],
    [v3(0, 0, 10), v3(10, 10, 10), v3(10, 0, 10)],
    //right
    [v3(10, 0, 0), v3(10, 10, 0), v3(10, 0, 10)],
    [v3(10, 10, 0), v3(10, 10, 10), v3(10, 0, 10)],
    //top
    [v3(0, 10, 0), v3(10, 10, 10), v3(10, 10, 0)],
    [v3(0, 10, 0), v3(0, 10, 10), v3(10, 10, 10)],
    //back
    [v3(0, 0, 0), v3(0, 10, 0), v3(10, 0, 0)],
    [v3(0, 10, 0), v3(10, 10, 0), v3(10, 0, 0)],
    //left
    [v3(0, 0, 0), v3(0, 10, 0), v3(0, 0, 10)],
    [v3(0, 10, 0), v3(0, 10, 10), v3(0, 0, 10)],
    //bottom
    [v3(0, 0, 0), v3(10, 0, 10), v3(10, 0, 0)],
    [v3(0, 0, 0), v3(0, 0, 10), v3(10, 0, 10)],
]);

task.spawn(() => {
    makeDot(new Vector3(20, 20, 20));
    let dot = makeDot(new Vector3(5, 5, 5));
    while (task.wait()) {
        if (mesh.isPointInside(dot.Position)) {
            dot.Color = new Color3(0, 1, 1);
        }
        else {
            dot.Color = new Color3(1, 0, 0);
        }
    }
})

task.spawn(() => {
    while (task.wait()) {
        mesh.constructWireframe();
        mesh.setTriangles([
            //front
            [corners[1], corners[3], corners[7]],
            [corners[1], corners[7], corners[5]],
            //right
            [corners[4], corners[6], corners[5]],
            [corners[6], corners[7], corners[5]],
            //top
            [corners[2], corners[7], corners[6]],
            [corners[2], corners[3], corners[7]],
            //back
            [corners[0], corners[2], corners[4]],
            [corners[2], corners[6], corners[4]],
            //left
            [corners[0], corners[2], corners[1]],
            [corners[2], corners[3], corners[1]],
            //bottom
            [corners[0], corners[5], corners[4]],
            [corners[0], corners[1], corners[5]],
        ].map((v) => {
            return new triangle([v[0].Position, v[1].Position, v[2].Position]);
        }))
    }
})

print('test done... elapsed time:', tick() - t);