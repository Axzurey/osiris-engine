export namespace Raylibclasses {
    let geowedge = new Instance("WedgePart");
    geowedge.Anchored = true;
    geowedge.TopSurface = Enum.SurfaceType.Smooth;
    geowedge.BottomSurface = Enum.SurfaceType.Smooth;

    export class triangle {
        points = {a: new Vector3(), b: new Vector3(), c: new Vector3()};
        properties: Map<keyof WritableInstanceProperties<WedgePart>, any> = new Map();
        w0: WedgePart = geowedge.Clone();
        w1: WedgePart = geowedge.Clone();
        width0 = 0;
        width1 = 0;
        constructor(a: Vector3, b: Vector3, c: Vector3, width0?: number, width1?: number, properties?: Map<keyof WritableInstanceProperties<WedgePart>, any>) {
            this.setpoints(a, b, c);
            this.properties = properties || new Map();
            this.setwidth(width0 || 0, width1 || 0);
        }
        setpoints(a: Vector3, b: Vector3, c: Vector3) {
            this.points.a = a;
            this.points.b = b;
            this.points.c = c;
        }
        setwidth(width0: number, width1: number) {
            this.width0 = width0;
            this.width1 = width1;
        }
        destroy() {
            this.w0.Destroy();
            this.w1.Destroy();
        }
        draw(parent: Instance) {
            this.properties.forEach((val, key) => {
                this.w0[key as never] = val as never;
                this.w1[key as never] = val as never;
            });

            let [a, b, c] = [this.points.a, this.points.b, this.points.c];
            let [ab, ac, bc] = [b.sub(a), c.sub(a), c.sub(b)];
            let [abd, acd, bcd] = [ab.Dot(ab), ac.Dot(ac), bc.Dot(bc)];

            if (abd > acd && abd > bcd) {
                [c, a] = [a, c];
            }
            else if (acd > bcd && acd > abd) {
                [a, b] = [b, a];
            }

            [ab, ac, bc] = [b.sub(a), c.sub(a), c.sub(b)];

            let right = ac.Cross(ab).Unit;
            let up = bc.Cross(right).Unit;
            let back = bc.Unit;

            let height = math.abs(ab.Dot(up));

            this.w0.Size = new Vector3(this.width0, height, math.abs(ab.Dot(back)));
            this.w0.CFrame = CFrame.fromMatrix(a.add(b).div(2), right, up, back);
            this.w0.Parent = parent;

            this.w1.Size = new Vector3(this.width1, height, math.abs(ac.Dot(back)));
            this.w1.CFrame = CFrame.fromMatrix(a.add(c).div(2), right.mul(-1), up, back.mul(-1));
            this.w1.Parent = parent;
        }
    }
    let linepart = new Instance("Part");
    linepart.Anchored = true;
    export class line {
        properties: Map<Partial<keyof WritableInstanceProperties<Part>>, any>;
        points: {a: Vector3, b: Vector3}
        width0: number
        width1: number
        w0: Part = linepart.Clone();
        constructor(a: Vector3, b: Vector3, width0?: number, width1?: number, properties?: Map<Partial<keyof WritableInstanceProperties<Part>>, any>) {
            this.properties = properties || new Map();
            this.points = {
                a: a,
                b: b
            };
            this.width0 = width0 || .1;
            this.width1 = width1 || .1
        }
        setpoints(a: Vector3, b: Vector3, c: Vector3) {
            this.points.a = a;
            this.points.b = b;
        }
        setwidth(width0: number, width1: number) {
            this.width0 = width0;
            this.width1 = width1;
        }
        destroy() {
            this.w0.Destroy()
        }
        draw(parent: Instance) {
            this.properties.forEach((val, key) => {
                this.w0[key as never] = val as never;
            });
            let lookat = CFrame.lookAt(this.points.b, this.points.a);
            let length = this.points.a.sub(this.points.b).Magnitude;
            let size = new Vector3(this.width0, this.width1, length);
            this.w0.CFrame = lookat.mul(new CFrame(0, 0, -length / 2));
            this.w0.Size = size;
            this.w0.Parent = parent;
        }
    }
}

export namespace Raylib {
    export function DrawTri(a: Vector3, b: Vector3, c: Vector3, width0?: number, width1?: number, properties?: Map<Partial<keyof WritableInstanceProperties<WedgePart>>, any>): Raylibclasses.triangle {
        return new Raylibclasses.triangle(a, b, c, width0, width1, properties);
    }
    export function DrawLine(a: Vector3, b: Vector3, width0?: number, width1?: number, properties?: Map<Partial<keyof WritableInstanceProperties<Part>>, any>): Raylibclasses.line {
        return new Raylibclasses.line(a, b, width0, width1, properties);
    }
}

export namespace mathf {
    //local
    const randomGenerator = new Random();
    const sin = math.sin;
    const tan = math.tan;
    const abs = math.abs;
    const cos = math.cos; //can swap with sin for roblox lookvector space
    const atan2 = math.atan2;
    const asin = math.asin;
    const acos = math.acos;
    const rad = math.rad; //:: x * pi / 180 
    const deg = math.deg; //:: x * 180 / pi
    const pi = math.pi;

    //types

    //constants
    export const inf = math.huge;
    export const e = 2.718281;
    export const tau = pi * 2;
    export const phi = 2.618033;
    export const earthGravity = 9.807;
    export const lightSpeed = 299792458;
    
    //functions
    export function vectorIsClose(v1: Vector3, v2: Vector3, limit: number): boolean {
        return v1.sub(v2).Magnitude <= limit ? true : false;
    };
    export function vector2IsSimilar(v1: Vector2, v2: Vector2, limit: number): boolean {
        if (math.abs(v1.X - v2.X) > limit) return false;
        if (math.abs(v1.Y - v2.Y) > limit) return false;
        return true;
    }
    export function random(min: number = 0, max: number = 1, count: number = 1): number | number[] {
        if (count === 1) {
            return randomGenerator.NextNumber(min, max);
        }
        else {
            let numbers: number[] = [];
            for (let i=0; i < count; i++) {
                numbers.push(randomGenerator.NextNumber(min, max));
            }
            return numbers;
        }
    };
    export function pointsOnCircle(radius: number, points: number, center?: Vector2): Vector2[] {
        let parray: Vector2[] = []
        let cpo = 360 / points
        for (let i = 1; i <= points; i++) {
            let theta = math.rad(cpo * i)
            let x = cos(theta) * radius
            let y = sin(theta) * radius
            parray.push(center? new Vector2(x, y).add(center) : new Vector2(x, y))
        }
        return parray
    }
    export function translationRequired(a: CFrame, b: CFrame): CFrame {
        return a.Inverse().mul(b);
    };
    export function vector2FromAngle(angle: number, radius?: number): Vector2 { //for a unit circle
        return new Vector2(cos(rad(angle) * (radius || 1)), sin(rad(angle)) * (radius || 1)) // x = cos(angle:rad) * r, y = sin(angle:rad) * r
    };
    export function angleFromVector2(v: Vector2): number { //for a unit circle
        return atan2(v.Y, v.X); //theta = atan2(y, x)
    }
    export function normalize(min: number, max: number, value: number): number {
        return (value - min) / (max - min);
    }
    export function denormalize(min: number, max: number, value: number): number {
        return (value * (max - min) + min);
    }
    export function uExtendingSpiral(t: number) {
        return new Vector2(t * cos(t), t * sin(t));
    }
    export function getConvergence(x1: number, x2: number, y1: number, y2: number, x3: number, x4: number, y3: number, y4: number) {
        let den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (den === 0) return;
        let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        let u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
        return [u, t]
    }
    export function uSquare(rotation: number = 0, radius: number): Vector2[] {
        let cx = 0;
        let cy = 0;
        function rotate(v1: Vector2) {
            let tx = v1.X - cx;
            let ty = v1.Y - cy;

            let rotatedX = tx * cos(rotation) - ty * sin(rotation);
            let rotatedY = tx * sin(rotation) - ty * cos(rotation);

            return new Vector2(rotatedX + cx, rotatedY + cy);
        }
        let x1 = new Vector2(1, 1).mul(radius);
        let x2 = new Vector2(1, -1).mul(radius);
        let x3 = new Vector2(-1, -1).mul(radius);
        let x4 = new Vector2(-1, 1).mul(radius);
        return [rotate(x1), rotate(x2), rotate(x3), rotate(x4)];
    }
    export function slope(v1: Vector2, v2: Vector2): number {
        return (v2.Y - v1.Y) / (v2.X - v1.X);
    }
    export function lerp(v0: number, v1: number, t: number): number {
        return v0 + t * (v1 - v0);
    }
}