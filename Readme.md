# 미사일 피하기 게임

## 개발 계획

- [x] 바탕화면 띄우기
- [x] Player & Cloud 생성
- [x] Clouds 움직이기 구현
- [x] player의 움직임에 따른 Clouds 움직임 구현

## 개발 과정 (2023-10-13)

<img src="./screen01.png" width="800">

- player의 각도에 따른 구름들의 세밀한 움직임 구현

```js
let direction = new Vector(
  -Math.sin(player.rotation),
  Math.cos(player.rotation)
);
```

- 핵심 코드
