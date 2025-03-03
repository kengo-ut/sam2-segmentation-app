import cv2
import matplotlib.pyplot as plt
import numpy as np
from PIL import Image


def apply_effect(image: Image.Image, mask: np.ndarray, effect: str) -> Image.Image:
    """
    マスク領域に指定のエフェクトを適用する。

    Parameters:
        image (Image.Image): 元画像 (PIL Image)
        mask (np.ndarray): True/False のマスク (H, W)
        effect (str): "blur" | "pixelate" | "grayscale" | "invert" | "edge" | "glow"

    Returns:
        Image.Image: エフェクト適用後の画像
    """
    img_cv = np.array(image)  # PIL → OpenCV (H, W, C)

    if effect == "blur":
        # ブラー
        kernel = np.zeros((15, 15))
        kernel[7, :] = np.ones(15) / 15
        img_effect = cv2.filter2D(img_cv, -1, kernel)

    elif effect == "pixelate":
        # モザイク（縮小→拡大）
        h, w = img_cv.shape[:2]
        small = cv2.resize(img_cv, (w // 10, h // 10), interpolation=cv2.INTER_LINEAR)
        img_effect = cv2.resize(small, (w, h), interpolation=cv2.INTER_NEAREST)

    elif effect == "grayscale":
        # グレースケール
        gray = cv2.cvtColor(img_cv, cv2.COLOR_RGB2GRAY)
        img_effect = cv2.cvtColor(gray, cv2.COLOR_GRAY2RGB)

    elif effect == "invert":
        # 色反転（ネガポジ変換）
        img_effect = 255 - img_cv

    elif effect == "edge":
        # エッジ検出（スケッチ風）
        gray = cv2.cvtColor(img_cv, cv2.COLOR_RGB2GRAY)
        edges = cv2.Canny(gray, 100, 200)
        img_effect = cv2.cvtColor(edges, cv2.COLOR_GRAY2RGB)

    elif effect == "glow":
        # 発光エフェクト（ぼかし）
        blur = cv2.GaussianBlur(img_cv, (21, 21), 10)
        img_effect = cv2.addWeighted(img_cv, 0.7, blur, 0.3, 0)

    else:
        return image  # 何も適用しない場合

    # マスク部分だけエフェクトを適用
    mask_3ch = np.stack([mask] * 3, axis=-1)
    result_img_cv = np.where(mask_3ch, img_effect, img_cv)

    return Image.fromarray(result_img_cv)  # OpenCV → PIL


def apply_mask_pil(
    image: Image.Image, mask_dict: dict[int, np.ndarray], effect
) -> Image.Image:
    """
    PILを使って元画像にセグメンテーションマスクを適用し、保存する。

    Parameters:
        image_path (str): 元画像のパス
        mask_dict (dict): {obj_id: mask_array} の辞書 (形状: (1, H, W), 値: True/False)
        output_path (str): 保存先のパス
    """
    # 元画像をPILで開く
    img = image.convert("RGBA")

    # マスクのオーバーレイ用レイヤーを作成（透明な画像）
    mask_overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))

    # 色のリスト（最大10色）
    cmap = plt.get_cmap("tab10")

    for obj_id, mask in mask_dict.items():
        mask = mask.squeeze(axis=0)
        mask_uint8 = (mask.astype(np.uint8)) * 255
        mask_pil = Image.fromarray(mask_uint8, mode="L")

        if effect == "color":
            color = np.array(cmap(obj_id)[:3]) * 255
            color_alpha = tuple(color.astype(int)) + (150,)
            colored_mask = Image.new("RGBA", img.size, color_alpha)
            mask_overlay.paste(colored_mask, (0, 0), mask_pil)
        else:
            img = apply_effect(img.convert("RGB"), mask.astype(bool), effect).convert(
                "RGBA"
            )

    # 元画像にマスクを重ねる
    result = Image.alpha_composite(img, mask_overlay)

    # RGBに変換して透過を防ぐ
    result = result.convert("RGB")

    return result
