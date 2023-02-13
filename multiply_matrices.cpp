#include <vector>
#include <chrono>
#include <emscripten.h>
using namespace std;

extern "C" {

int multiply_matrice(float matrix1[][1000], float matrix2[][1000], int row1, int col1, int row2, int col2) {
  if (col1 != row2) {
    return -1; // Indicates that the matrices cannot be multiplied
  }
  float result[1000][1000];
  for (int i = 0; i < row1; i++) {
    for (int j = 0; j < col2; j++) {
      result[i][j] = 0.0;
      for (int k = 0; k < col1; k++) {
        result[i][j] += matrix1[i][k] * matrix2[k][j];
      }
    }
  }

  return 0; // Indicates success
}

}




